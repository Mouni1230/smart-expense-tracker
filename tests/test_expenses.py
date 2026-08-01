from fastapi.testclient import TestClient

from src.main import app
from src.storage import expenses

client = TestClient(app)


def setup_function() -> None:
    expenses.clear()


def make_expense(
    expense_id: int = 1,
    title: str = "Lunch",
    amount: float = 250.0,
    category: str = "Food",
    expense_date: str = "2026-07-31",
) -> dict:
    return {
        "id": expense_id,
        "title": title,
        "amount": amount,
        "category": category,
        "date": expense_date,
    }


def test_add_expense() -> None:
    response = client.post("/expenses", json=make_expense())

    assert response.status_code == 201
    assert response.json()["id"] == 1
    assert response.json()["amount"] == 250.0


def test_duplicate_expense_id() -> None:
    client.post("/expenses", json=make_expense())

    response = client.post(
        "/expenses",
        json=make_expense(title="Another lunch"),
    )

    assert response.status_code == 409


def test_get_all_expenses() -> None:
    client.post("/expenses", json=make_expense())
    client.post(
        "/expenses",
        json=make_expense(
            expense_id=2,
            title="Bus",
            amount=50,
            category="Travel",
        ),
    )

    response = client.get("/expenses")

    assert response.status_code == 200
    assert len(response.json()) == 2


def test_filter_by_category() -> None:
    client.post("/expenses", json=make_expense())
    client.post(
        "/expenses",
        json=make_expense(
            expense_id=2,
            title="Bus",
            amount=50,
            category="Travel",
        ),
    )

    response = client.get("/expenses?category=food")

    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["category"] == "Food"


def test_total_expenses() -> None:
    client.post("/expenses", json=make_expense(amount=250))
    client.post(
        "/expenses",
        json=make_expense(expense_id=2, amount=50, category="Travel"),
    )

    response = client.get("/expenses/total")

    assert response.status_code == 200
    assert response.json()["total"] == 300.0


def test_total_by_category() -> None:
    client.post("/expenses", json=make_expense(amount=250))
    client.post(
        "/expenses",
        json=make_expense(
            expense_id=2,
            amount=100,
            category="Food",
        ),
    )
    client.post(
        "/expenses",
        json=make_expense(
            expense_id=3,
            amount=50,
            category="Travel",
        ),
    )

    response = client.get("/expenses/total?category=Food")

    assert response.status_code == 200
    assert response.json()["total"] == 350.0
    assert response.json()["category"] == "Food"


def test_delete_expense() -> None:
    client.post("/expenses", json=make_expense())

    response = client.delete("/expenses/1")

    assert response.status_code == 204
    assert client.get("/expenses").json() == []


def test_delete_missing_expense() -> None:
    response = client.delete("/expenses/999")

    assert response.status_code == 404


def test_invalid_amount() -> None:
    response = client.post(
        "/expenses",
        json=make_expense(amount=-10),
    )

    assert response.status_code == 422
