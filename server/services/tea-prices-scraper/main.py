import requests
from bs4 import BeautifulSoup
import sqlite3


def get_all_years(table_row) -> dict:
    """Get the years and index them in a dictionary"""
    years = {}
    cell_index = 1  # manual index and starts from 1 to skip index 0 that contains text 'Months'
    for cell in table_row:
        cell_text = str(cell.string).strip()
        if cell_text != '' and cell_text != 'Months':
            years[cell_index] = cell_text
            cell_index += 1
    return years


def get_year(cell_index, year_index):
    """Get the year of the data in a cell through its index"""

    if cell_index == 0:  # row index 0 in a data row contains the month name
        return None
    if cell_index % 2 == 0:
        return year_index[int(cell_index / 2)]
    return year_index[int((cell_index + 1) / 2)]


def get_currency(cell_index):
    """Get the currency unit from the index of the cell in a table row"""

    if cell_index == 0:  # index 0 contains the name of the month
        return None
    if cell_index % 2 == 0:
        return 'usd'
    return 'lkr'


def get_price_list(table_rows) -> list:
    prices = []
    for row in table_rows:
        index = 0
        month = ''
        for cell in row.contents:
            cell_text = str(cell.string).strip()
            if index == 0 and cell_text != '':
                month = cell_text
                index += 1
                continue

            if cell_text != '':
                print(index, cell, get_currency(index), month, get_year(index, years_dict))
                prices.append((cell_text, get_currency(index), month, get_year(index, years_dict)))
                index += 1
    return prices


request_headers = {
    'Host': 'teasrilanka.org',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) '
                  'Chrome/89.0.4389.114 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,'
              'application/signed-exchange;v=b3;q=0.9',
    'Accept-Encoding': 'gzip,deflate',
    'Accept-Language': 'en-US,en;q=0.9'
}

request_url = "http://teasrilanka.org/tea-prices"

response = requests.get(url=request_url, headers=request_headers)

soup = BeautifulSoup(response.content, 'html.parser')
rows = soup.find_all('tr')
header_row = rows[0]  # first row contains the years
data_rows = rows[2:]  # remove first (year row) and second (currency units row) rows

years_dict = get_all_years(header_row)
price_list = get_price_list(data_rows)

# save price list in sqlite database
connection = sqlite3.connect('prices.db')
cursor = connection.cursor()
cursor.execute('DROP TABLE IF EXISTS tea')
cursor.execute('CREATE TABLE IF NOT EXISTS tea (price TEXT, currency TEXT, month TEXT, year TEXT)')
cursor.executemany('INSERT INTO tea (price, currency, month, year) VALUES (?, ?, ?, ?)', price_list)
connection.commit()
# connection.close()
