from fastapi import FastAPI, HTTPException, Query, status
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from .models import Expense, TotalResponse
from .storage import expenses

app = FastAPI(
    title="Smart Expense Tracker API",
    description="REST API for managing personal expenses.",
    version="1.0.0",
)

# Serve CSS and JavaScript files
app.mount("/static", StaticFiles(directory="frontend"), name="static")


# Open HTML page when visiting the root URL
@app.get("/")
def home():
    return FileResponse("frontend/index.html")


@app.post("/expenses", response_model=Expense, status_code=status.HTTP_201_CREATED)
def add_expense(expense: Expense) -> Expense:
    if expense.id in expenses:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Expense with id {expense.id} already exists.",
        )

    expenses[expense.id] = expense
    return expense


@app.get("/expenses", response_model=list[Expense])
def get_expenses(
    category: str | None = Query(default=None, min_length=1)
) -> list[Expense]:
    if category is None:
        return list(expenses.values())

    return [
        expense
        for expense in expenses.values()
        if expense.category.lower() == category.lower()
    ]


@app.get("/expenses/total", response_model=TotalResponse)
def get_total(
    category: str | None = Query(default=None, min_length=1)
) -> TotalResponse:
    if category is None:
        total = sum(expense.amount for expense in expenses.values())
        return TotalResponse(total=round(total, 2))

    total = sum(
        expense.amount
        for expense in expenses.values()
        if expense.category.lower() == category.lower()
    )
    return TotalResponse(
        total=round(total, 2),
        category=category,
    )


@app.delete("/expenses/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(expense_id: int) -> None:
    if expense_id not in expenses:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Expense with id {expense_id} not found.",
        )

    del expenses[expense_id]