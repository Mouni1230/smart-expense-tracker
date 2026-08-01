# Smart Expense Tracker API

A simple REST API for managing personal expenses, built with Python and FastAPI.

## Features

- Add an expense
- View all expenses
- Filter expenses by category
- Calculate total expenses overall
- Calculate total expenses for a category
- Delete an expense
- Automatic OpenAPI/Swagger documentation
- Automated tests with pytest
- In-memory storage; no database required

## Project structure

```text
smart-expense-tracker/
├── README.md
├── AI_NOTES.md
├── requirements.txt
├── src/
│   ├── __init__.py
│   ├── main.py
│   ├── models.py
│   └── storage.py
└── tests/
    ├── __init__.py
    └── test_expenses.py
```

## Requirements

- Python 3.10 or newer
- pip

## Installation

Create and activate a virtual environment.

### Windows

```bash
python -m venv .venv
.venv\Scripts\activate
```

### macOS/Linux

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

## Run the server

From the project root:

```bash
uvicorn src.main:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

Swagger UI:

```text
http://127.0.0.1:8000/docs
```

ReDoc:

```text
http://127.0.0.1:8000/redoc
```

## Run tests

```bash
pytest -q
```

## API endpoints

### Add an expense

```http
POST /expenses
```

Example request:

```json
{
  "id": 1,
  "title": "Lunch",
  "amount": 250,
  "category": "Food",
  "date": "2026-07-31"
}
```

### View all expenses

```http
GET /expenses
```

### Filter by category

```http
GET /expenses?category=Food
```

Category matching is case-insensitive.

### Calculate overall total

```http
GET /expenses/total
```

Example response:

```json
{
  "total": 300.0,
  "category": null
}
```

### Calculate total for one category

```http
GET /expenses/total?category=Food
```

Example response:

```json
{
  "total": 350.0,
  "category": "Food"
}
```

### Delete an expense

```http
DELETE /expenses/{expense_id}
```

A successful delete returns HTTP 204.

## Notes

Data is stored in memory, so it is cleared whenever the server restarts. No database is required for this assignment.
