# AI Notes

AI tools were used during development of this assignment. The purpose of this file is to document where AI assistance was used and how the output was reviewed.

## 1. AI-generated vs. personally written work

AI assistance was used to create the initial project structure and draft:
- FastAPI application setup
- Pydantic expense model
- In-memory storage
- REST endpoints for create, list/filter, totals, and delete
- pytest test cases
- README structure

The final repository should be reviewed and edited by the applicant before submission so that the applicant understands and can explain every part of the implementation.

## 2. Validation, testing, and changes

The implementation was reviewed against the assignment requirements:
- Add expense with id, title, amount, category, and date
- View all expenses
- Filter by category
- Calculate overall total
- Calculate total by category
- Delete an expense
- Store data without a database

The tests cover:
- Successful expense creation
- Duplicate IDs
- Listing expenses
- Category filtering
- Overall totals
- Category totals
- Successful deletion
- Missing expense deletion
- Validation for negative amounts

Before submitting, the applicant should run the commands in README.md from a clean checkout and inspect the Swagger UI.

## 3. AI suggestions not used

Some possible extensions, such as adding a database, authentication, Docker, and a full frontend, were not used because the assignment explicitly allows in-memory/local storage and asks for a small REST API. Keeping the implementation focused reduces unnecessary complexity and aligns with the stated scope.

## Final verification before submission

The applicant should personally verify:
1. Every endpoint in Swagger works.
2. `pytest -q` passes.
3. The README commands work on a clean checkout.
4. The GitHub repository contains README.md, AI_NOTES.md, src/, and tests/.
5. The final commit is pushed to the main branch before the deadline.
