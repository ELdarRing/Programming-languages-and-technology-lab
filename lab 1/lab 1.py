// задание 17
deposit = float(input("Введите сумму вклада: "))
interest_rate = float(input("Введите годовую процентную ставку (%): "))
years = int(input("Введите количество лет: "))

rate = interest_rate / 100

final_amount = deposit * (1 + rate) ** years

print("Итоговая сумма:", final_amount)

// задание 4
celsius = float(input("Введите температуру в градусах Цельсия: "))

fahrenheit = celsius * 9 / 5 + 32
kelvin = celsius + 273.15

print("Температура в Фаренгейтах:", fahrenheit)
print("Температура в Кельвинах:", kelvin)

// задание 11

price = float(input("Введите цену товара: "))
quantity = int(input("Введите количество товара: "))

purchase_cost = price * quantity
vat = purchase_cost * 0.12
total_cost = purchase_cost + vat

print("Стоимость покупки:", purchase_cost)
print("НДС 12%:", vat)
print("Итоговая стоимость:", total_cost)
