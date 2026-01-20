from __future__ import annotations

from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from app.data import (
    BLEND_OUTCOME_AXES,
    CUSTOM_BLEND_SIZES,
    CUSTOM_BLEND_OUTCOMES,
    FLAVOR_CATEGORIES,
    PRODUCTS,
    BlendOutcome,
    get_product,
)

BASE_DIR = Path(__file__).resolve().parent

app = FastAPI(title="Tea Alchemy")

app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")

templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))


OUTCOME_AXIS_OVERRIDES = {"energy": "Alertness"}


def build_blend_outcomes() -> list[BlendOutcome]:
    outcomes: list[BlendOutcome] = []
    for outcome in CUSTOM_BLEND_OUTCOMES:
        axis = OUTCOME_AXIS_OVERRIDES.get(outcome.id, outcome.title)
        sorted_bases = sorted(
            outcome.bases,
            key=lambda base: base.alignment.get(axis, 0),
            reverse=True,
        )
        outcomes.append(outcome.copy(update={"bases": sorted_bases[:6]}))
    return outcomes


def build_blend_context(request: Request) -> dict:
    return {
        "request": request,
        "outcomes": build_blend_outcomes(),
        "outcome_axes": BLEND_OUTCOME_AXES,
        "flavor_categories": FLAVOR_CATEGORIES,
        "blend_sizes": CUSTOM_BLEND_SIZES,
    }


@app.get("/", response_class=HTMLResponse)
async def product_listing(request: Request):
    return templates.TemplateResponse(
        "index.html",
        {
            "request": request,
            "products": PRODUCTS,
        },
    )


@app.get("/products/{product_id}", response_class=HTMLResponse)
async def product_detail(request: Request, product_id: str):
    product = get_product(product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")

    return templates.TemplateResponse(
        "product_detail.html",
        {
            "request": request,
            "product": product,
        },
    )


@app.get("/custom-blend", response_class=HTMLResponse)
async def custom_blend_step_one(request: Request):
    return templates.TemplateResponse(
        "custom_blend_step1.html",
        build_blend_context(request),
    )


@app.get("/custom-blend/step-1", response_class=HTMLResponse)
async def custom_blend_step_one_page(request: Request):
    return templates.TemplateResponse(
        "custom_blend_step1.html",
        build_blend_context(request),
    )


@app.get("/custom-blend/step-2", response_class=HTMLResponse)
async def custom_blend_step_two_page(request: Request):
    return templates.TemplateResponse(
        "custom_blend_step2.html",
        build_blend_context(request),
    )


@app.get("/custom-blend/step-3", response_class=HTMLResponse)
async def custom_blend_step_three_page(request: Request):
    return templates.TemplateResponse(
        "custom_blend_step3.html",
        build_blend_context(request),
    )


@app.get("/custom-blend/step-4", response_class=HTMLResponse)
async def custom_blend_step_four_page(request: Request):
    return templates.TemplateResponse(
        "custom_blend_step4.html",
        build_blend_context(request),
    )


@app.get("/cart", response_class=HTMLResponse)
async def cart_review(request: Request):
    return templates.TemplateResponse("cart.html", {"request": request})


@app.get("/checkout", response_class=HTMLResponse)
async def checkout(request: Request):
    return templates.TemplateResponse("checkout.html", {"request": request})


@app.get("/confirmation", response_class=HTMLResponse)
async def confirmation(request: Request):
    return templates.TemplateResponse("confirmation.html", {"request": request})
