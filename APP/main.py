from __future__ import annotations

from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from app.data import PRODUCTS, get_product

BASE_DIR = Path(__file__).resolve().parent

app = FastAPI(title="Tea Alchemy")

app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")

templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))


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
