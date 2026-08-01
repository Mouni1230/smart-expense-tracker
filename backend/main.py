from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional


app = FastAPI(title="Smart Expense Tracker API")



# Expense data model
class Expense(BaseModel):
    title: str
    amount: float
    category: str
    date: str


# Temporary in-memory storage
expenses = []


# 1. Add an expense
@app.post("/expenses")
def add_expense(expense: Expense):
    new_expense = {
        "id": len(expenses) + 1,
        "title": expense.title,
        "amount": expense.amount,
        "category": expense.category,
        "date": expense.date
    }

    expenses.append(new_expense)

    return new_expense


# 2. View all expenses
@app.get("/expenses")
def get_expenses(category: Optional[str] = None):
    if category:
        return [
            expense for expense in expenses
            if expense["category"].lower() == category.lower()
        ]

    return expenses


# 3. Calculate total expenses
@app.get("/expenses/total")
def get_total(category: Optional[str] = None):
    if category:
        total = sum(
            expense["amount"]
            for expense in expenses
            if expense["category"].lower() == category.lower()
        )
    else:
        total = sum(expense["amount"] for expense in expenses)

    return {
        "category": category if category else "Overall",
        "total": total
    }


# 4. Delete an expense
@app.delete("/expenses/{expense_id}")
def delete_expense(expense_id: int):
    for expense in expenses:
        if expense["id"] == expense_id:
            expenses.remove(expense)
            return {
                "message": "Expense deleted successfully",
                "deleted_expense": expense
            }

    return {
        "message": "Expense not found"
    }