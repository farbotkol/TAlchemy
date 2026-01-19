from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

app = FastAPI()

app.mount("/static", StaticFiles(directory="app/static"), name="static")

templates = Jinja2Templates(directory="app/templates")


@app.get("/", response_class=HTMLResponse)
def read_home(request: Request) -> HTMLResponse:
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/products/{slug}", response_class=HTMLResponse)
def read_product(request: Request, slug: str) -> HTMLResponse:
    product = {
        "name": "Midnight Earl Grey",
        "tagline": "Citrus, bergamot, and velvet black tea.",
        "price": 18.0,
        "notes": ["Candied orange", "Bergamot oil", "Black tea tannins"],
        "ingredients": ["Assam black tea", "Bergamot peel", "Cornflower petals"],
        "sizes": ["50g tin", "100g pouch", "Sampler trio"],
        "slug": slug,
    }
    return templates.TemplateResponse(
        "product.html", {"request": request, "product": product}
    )
