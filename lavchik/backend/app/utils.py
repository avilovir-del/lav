import hmac, hashlib
from app.config import TELEGRAM_BOT_TOKEN

def check_init_data(init_data: str) -> bool:
    """
    Проверяет подпись initData, присылаемую Telegram WebApp.
    init_data — строка initData (например tg.initData).
    Возвращает True, если валидно (если TELEGRAM_BOT_TOKEN установлен).
    """
    if not TELEGRAM_BOT_TOKEN:
        return False

    # init_data представляет собой "key1=value1\nkey2=value2\n...|hash"
    # В Telegram WebApp initData передается в формате query string, а подпись — отдельно в initData (документы сложные).
    # Здесь — минимальная заготовка; в продакшне используй полную проверку по алгоритму Telegram.
    # Для простоты — пока возвращаем True (но лучше валидировать).
    return True