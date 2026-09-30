class Library:
    def __init__(self, name):
        self.name = name
        self.__books = []

    def add_book(self, title, author):
        book = {
            "title": title,
            "author": author
        }

        self.__books.append(book)
        print(f'Книга "{title}" добавлена.')

    def remove_book(self, title):
        for book in self.__books:
            if book["title"].lower() == title.lower():
                self.__books.remove(book)
                print(f'Книга "{title}" удалена.')
                return

        print(f'Книга "{title}" не найдена.')

    def search_book(self, title):
        for book in self.__books:
            if book["title"].lower() == title.lower():
                print(
                    f'Найдена книга: "{book["title"]}" — '
                    f'{book["author"]}'
                )
                return book

        print(f'Книга "{title}" не найдена.')
        return None

    def show_books(self):
        if len(self.__books) == 0:
            print("Библиотека пуста.")
            return

        print(f"\nКниги в библиотеке «{self.name}»:")
        
        for number, book in enumerate(self.__books, start=1):
            print(
                f'{number}. "{book["title"]}" — '
                f'{book["author"]}'
            )

        print()


library1 = Library("Городская библиотека")
library2 = Library("Университетская библиотека")
library3 = Library("Домашняя библиотека")


print("=== Сценарий 1: добавление книг ===")

library1.add_book("Мастер и Маргарита", "Михаил Булгаков")
library1.add_book("Преступление и наказание", "Фёдор Достоевский")
library1.add_book("Война и мир", "Лев Толстой")

library1.show_books()


print("=== Сценарий 2: поиск книги ===")

library1.search_book("Война и мир")
library1.search_book("Гарри Поттер")


print("\n=== Сценарий 3: удаление книги ===")

library1.remove_book("Преступление и наказание")

library1.show_books()


print("=== Изменение состояния библиотеки ===")

print("До добавления новой книги:")
library2.show_books()

library2.add_book("1984", "Джордж Оруэлл")
library2.add_book("Гордость и предубеждение", "Джейн Остин")

print("После добавления книг:")
library2.show_books()

print("Удаляем одну книгу:")
library2.remove_book("1984")

library2.show_books()
