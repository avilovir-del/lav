import os
import asyncio
from aiogram import Bot, Dispatcher, types
from aiogram.utils import executor
import httpx
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN")
API_URL = os.getenv("API_URL", "http://localhost:8000")
API_KEY = os.getenv("API_KEY")
ADMIN_ID = int(os.getenv("ADMIN_ID", "0"))

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher(bot)
headers = {"x-api-key": API_KEY} if API_KEY else {}

@dp.message_handler(commands=["start"])
async def cmd_start(m: types.Message):
    await m.answer("Админ-бот запущен. Используй /check чтобы посмотреть заявки.")

@dp.message_handler(commands=["check"])
async def cmd_check(m: types.Message):
    if m.from_user.id != ADMIN_ID:
        return await m.reply("Нет доступа.")
    async with httpx.AsyncClient() as client:
        r = await client.get(f"{API_URL}/admin/submissions", headers=headers)
    if r.status_code != 200:
        return await m.reply("Ошибка запроса заявок.")
    data = r.json()
    if not data:
        return await m.reply("Нет заявок на проверку.")
    for s in data:
        # Для отображения возьмём task title через отдельный запрос или включим его в response
        text = f"ID: {s['id']}\nuser_id: {s['user_id']}\ntask_id: {s['task_id']}\nstatus: {s['status']}\nnote: {s.get('note')}\ncreated: {s.get('created_at')}"
        kb = types.InlineKeyboardMarkup().add(
            types.InlineKeyboardButton("✅ Одобрить", callback_data=f"approve:{s['id']}"),
            types.InlineKeyboardButton("❌ Отклонить", callback_data=f"reject:{s['id']}")
        )
        await m.answer(text, reply_markup=kb)

@dp.callback_query_handler(lambda c: c.data and c.data.startswith("approve:"))
async def cb_approve(c: types.CallbackQuery):
    if c.from_user.id != ADMIN_ID:
        return await c.answer("Нет доступа", show_alert=True)
    sub_id = int(c.data.split(":")[1])
    async with httpx.AsyncClient() as client:
        r = await client.post(f"{API_URL}/admin/approve/{sub_id}", headers=headers)
    if r.status_code == 200:
        resp = r.json()
        await c.answer("Одобрено ✅")
        await c.message.edit_reply_markup()
        await c.message.reply(f"Баланс пользователя обновлён: {resp.get('new_balance')}")
    else:
        await c.answer("Ошибка при одобрении", show_alert=True)

@dp.callback_query_handler(lambda c: c.data and c.data.startswith("reject:"))
async def cb_reject(c: types.CallbackQuery):
    if c.from_user.id != ADMIN_ID:
        return await c.answer("Нет доступа", show_alert=True)
    sub_id = int(c.data.split(":")[1])
    async with httpx.AsyncClient() as client:
        r = await client.post(f"{API_URL}/admin/reject/{sub_id}", json={"reason":"Отклонено админом"}, headers=headers)
    if r.status_code == 200:
        await c.answer("Отклонено ❌")
        await c.message.edit_reply_markup()
    else:
        await c.answer("Ошибка при отклонении", show_alert=True)

if name == "__main__":
    executor.start_polling(dp, skip_updates=True)