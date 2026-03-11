import asyncio
import hashlib
import hmac
from urllib.parse import parse_qsl


async def check_hash_telegram(init_data, bot_token):
    parsed_data = dict(parse_qsl(init_data, keep_blank_values=True))

    telegram_hash = parsed_data.pop("hash", None)
    if telegram_hash is None:
        return False

    data_check_string = "\n".join(
        f"{key}={value}" for key, value in sorted(parsed_data.items())
    )

    secret_key = hmac.new(
        b"WebAppData",
        bot_token.encode(),
        hashlib.sha256
    ).digest()

    calculated_hash = hmac.new(
        secret_key,
        data_check_string.encode(),
        hashlib.sha256
    ).hexdigest()

    print("calculated_hash:", calculated_hash)
    print("telegram_hash:  ", telegram_hash)

    return hmac.compare_digest(calculated_hash, telegram_hash)


async def main():
    from urllib.parse import unquote, parse_qs

    # Сырой fragment из URL Telegram
    raw_fragment = (
        "tgWebAppData=query_id%3DAAGEI6IhAwAAAIQjoiESaujW%26user%3D%257B%2522id%2522%253A7006724996%252C%2522first_name%2522%253A%2522QuantumCode%2522%252C%2522last_name%2522%253A%2522%2522%252C%2522username%2522%253A%2522QuantiumCode%2522%252C%2522language_code%2522%253A%2522ru%2522%252C%2522allows_write_to_pm%2522%253Atrue%252C%2522photo_url%2522%253A%2522https%253A%255C%252F%255C%252Ft.me%255C%252Fi%255C%252Fuserpic%255C%252F320%255C%252FrfAiMbKem6ri4JCr8WeZyZvZJx1Qqz21QyO3UWvlA2dtPpzZKyllQJmMZxN8ygI-.svg%2522%257D%26auth_date%3D1773245096%26signature%3DpH1cHpWocAIpQO_Iq0YG20HMLP9MrW8cffImZ9XcsFqa7MNU1hDQNmtOc3e8jqUMH9jp020xEA9AhHPcDP6pBw%26hash%3Dffc0741c3c499a4c9eb923b9b224697ac43d21716b26d7188b75280ea54eb750"
        "&tgWebAppVersion=9.5&tgWebAppPlatform=web"
    )

    # 1. Достаём tgWebAppData из fragment
    params = parse_qs(raw_fragment)
    tg_web_app_data = params["tgWebAppData"][0]
    print("tgWebAppData (1x decoded):")
    print(tg_web_app_data)
    print()

    # 2. Это то что WebApp.initData возвращает
    # Telegram SDK сам делает 1 decode, поэтому WebApp.initData = unquote(tgWebAppData)
    init_data = unquote(tg_web_app_data)
    print("initData (2x decoded = WebApp.initData):")
    print(init_data)
    print()

    bot_token = "8247596720:AAGL2zg6B-7d2Id0FhBg4xtCJVOC3hYEeRU"

    # Тест 1: tgWebAppData как есть (1x decoded)
    print("=== Test 1: tgWebAppData (1x decoded) ===")
    is_valid_1 = await check_hash_telegram(tg_web_app_data, bot_token)
    print("is_valid:", is_valid_1)
    print()

    # Тест 2: полностью decoded (как WebApp.initData)
    print("=== Test 2: initData (2x decoded) ===")
    is_valid_2 = await check_hash_telegram(init_data, bot_token)
    print("is_valid:", is_valid_2)


if __name__ == "__main__":
    asyncio.run(main())
