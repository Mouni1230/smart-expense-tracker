const API_URL = "http://127.0.0.1:8000";

let allExpenses = [];


// ===============================
// ADD EXPENSE
// ===============================

async function addExpense() {

    const title = document.getElementById("title").value.trim();
    const amount = Number(document.getElementById("amount").value);
    const category = document.getElementById("category").value.trim();
    const date = document.getElementById("date").value;

    if (!title || !amount || !category || !date) {
        showToast("⚠️ Please fill all fields");
        return;
    }

    try {

        const response = await fetch(`${API_URL}/expenses`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                id:Date.now(),
                title: title,
                amount: amount,
                category: category,
                date: date
            })
        });

        if (!response.ok) {
            throw new Error("Failed to add expense");
        }

        showToast("✅ Expense added successfully!");

        // Clear form
        document.getElementById("title").value = "";
        document.getElementById("amount").value = "";
        document.getElementById("category").value = "";
        document.getElementById("date").value = "";

        // Reload data
        await loadExpenses();

    } catch (error) {

        console.error(error);

        showToast("❌ Failed to add expense");
    }
}


// ===============================
// LOAD EXPENSES
// ===============================

async function loadExpenses() {

    try {

        const response = await fetch(`${API_URL}/expenses`);

        if (!response.ok) {
            throw new Error("Failed to load expenses");
        }

        allExpenses = await response.json();

        updateStatistics();

        filterExpenses();

    } catch (error) {

        console.error("Error loading expenses:", error);

        showToast("❌ Could not load expenses");
    }
}


// ===============================
// DISPLAY EXPENSES
// ===============================

function displayExpenses(expenses) {

    const expenseList = document.getElementById("expenseList");

    const emptyState = document.getElementById("emptyState");

    expenseList.innerHTML = "";


    if (expenses.length === 0) {

        emptyState.style.display = "block";

        return;

    } else {

        emptyState.style.display = "none";
    }


    expenses.forEach(expense => {

        const div = document.createElement("div");

        div.className = "expense";


        const icon = getCategoryIcon(expense.category);


        div.innerHTML = `

            <div class="expense-info">

                <div class="expense-icon">
                    ${icon}
                </div>

                <div>

                    <div class="expense-title">
                        ${escapeHTML(expense.title)}
                    </div>

                    <div class="expense-meta">
                        ${escapeHTML(expense.category)}
                        •
                        ${expense.date}
                    </div>

                </div>

            </div>


            <div class="expense-right">

                <div class="expense-amount">
                    ₹${Number(expense.amount).toLocaleString("en-IN")}
                </div>

                <button
                    class="delete-btn"
                    onclick="deleteExpense(${expense.id})"
                    title="Delete expense"
                >
                    🗑️
                </button>

            </div>

        `;


        expenseList.appendChild(div);

    });

}


// ===============================
// FILTER EXPENSES
// ===============================

function filterExpenses() {

    const searchText =
        document.getElementById("searchInput")
        .value
        .toLowerCase()
        .trim();


    const selectedCategory =
        document.getElementById("categoryFilter")
        .value
        .toLowerCase();


    const filteredExpenses = allExpenses.filter(expense => {

        const matchesSearch =
            expense.title.toLowerCase().includes(searchText) ||
            expense.category.toLowerCase().includes(searchText);


        const matchesCategory =
            selectedCategory === "all" ||
            expense.category.toLowerCase() === selectedCategory;


        return matchesSearch && matchesCategory;

    });


    displayExpenses(filteredExpenses);

}


// ===============================
// STATISTICS
// ===============================

function updateStatistics() {

    const total = allExpenses.reduce(
        (sum, expense) => sum + Number(expense.amount),
        0
    );


    const transactionCount = allExpenses.length;


    const average =
        transactionCount > 0
            ? total / transactionCount
            : 0;


    // Total
    document.getElementById("total").textContent =
        total.toLocaleString("en-IN");


    // Transaction count
    document.getElementById("transactionCount").textContent =
        transactionCount;


    // Average
    document.getElementById("averageExpense").textContent =
        Math.round(average).toLocaleString("en-IN");


    // Overview total
    document.getElementById("overviewTotal").textContent =
        total.toLocaleString("en-IN");


    updateCategoryTotals();

}


// ===============================
// CATEGORY TOTALS
// ===============================

function updateCategoryTotals() {

    let food = 0;

    let transport = 0;

    let shopping = 0;

    let other = 0;


    allExpenses.forEach(expense => {

        const category =
            expense.category.toLowerCase();


        const amount =
            Number(expense.amount);


        if (category === "food") {

            food += amount;

        } else if (category === "transport") {

            transport += amount;

        } else if (category === "shopping") {

            shopping += amount;

        } else {

            other += amount;

        }

    });


    document.getElementById("foodTotal").textContent =
        `₹${food.toLocaleString("en-IN")}`;


    document.getElementById("transportTotal").textContent =
        `₹${transport.toLocaleString("en-IN")}`;


    document.getElementById("shoppingTotal").textContent =
        `₹${shopping.toLocaleString("en-IN")}`;


    document.getElementById("otherTotal").textContent =
        `₹${other.toLocaleString("en-IN")}`;

}


// ===============================
// DELETE EXPENSE
// ===============================

async function deleteExpense(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this expense?");


    if (!confirmDelete) {
        return;
    }


    try {

        const response =
            await fetch(`${API_URL}/expenses/${id}`, {

                method: "DELETE"

            });


        if (!response.ok) {

            throw new Error("Failed to delete expense");

        }


        showToast("🗑️ Expense deleted successfully!");


        await loadExpenses();


    } catch (error) {

        console.error(error);

        showToast("❌ Failed to delete expense");

    }

}


// ===============================
// CATEGORY ICONS
// ===============================

function getCategoryIcon(category) {

    const value =
        category.toLowerCase();


    if (value === "food") {
        return "🍔";
    }


    if (value === "transport") {
        return "🚗";
    }


    if (value === "shopping") {
        return "🛍️";
    }


    if (value === "bills") {
        return "💡";
    }


    if (value === "health") {
        return "🏥";
    }


    if (value === "education") {
        return "📚";
    }


    return "📦";

}


// ===============================
// TOAST NOTIFICATION
// ===============================

function showToast(message) {

    const toast =
        document.getElementById("toast");


    toast.textContent = message;


    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}


// ===============================
// DARK MODE
// ===============================

function toggleTheme() {

    document.body.classList.toggle("dark");


    const themeButton =
        document.getElementById("themeToggle");


    if (document.body.classList.contains("dark")) {

        themeButton.textContent = "☀️";

        localStorage.setItem("theme", "dark");

    } else {

        themeButton.textContent = "🌙";

        localStorage.setItem("theme", "light");

    }

}


// ===============================
// HTML SECURITY
// ===============================

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;

}


// ===============================
// LOAD SAVED THEME
// ===============================

function loadTheme() {

    const savedTheme =
        localStorage.getItem("theme");


    if (savedTheme === "dark") {

        document.body.classList.add("dark");

        document.getElementById("themeToggle")
            .textContent = "☀️";

    }

}


// ===============================
// INITIALIZE APPLICATION
// ===============================

window.onload = function() {

    loadTheme();

    loadExpenses();

};