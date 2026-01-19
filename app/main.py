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


@app.get("/blend/step-1", response_class=HTMLResponse)
def blend_step_one(request: Request) -> HTMLResponse:
    profiles = [
        {
            "title": "Citrus Lift",
            "notes": "Yuzu, lemongrass, white tea",
            "mood": "Bright & focused",
        },
        {
            "title": "Velvet Spice",
            "notes": "Cinnamon, clove, black tea",
            "mood": "Cozy & grounding",
        },
        {
            "title": "Garden Calm",
            "notes": "Chamomile, mint, oat straw",
            "mood": "Soft & serene",
        },
    ]
    return templates.TemplateResponse(
        "blend-step-1.html", {"request": request, "profiles": profiles}
    )


@app.get("/blend/step-2", response_class=HTMLResponse)
def blend_step_two(request: Request) -> HTMLResponse:
    sizes = ["50g tin", "100g pouch", "Sampler trio"]
    return templates.TemplateResponse(
        "blend-step-2.html", {"request": request, "sizes": sizes}
    )


@app.get("/blend/step-3", response_class=HTMLResponse)
def blend_step_three(request: Request) -> HTMLResponse:
    summary = {
        "profile": "Citrus Lift",
        "size": "50g tin",
        "name": "Dawn Citrus Ritual",
        "price": 24.0,
        "notes": ["Yuzu peel", "White peony tea", "Lemongrass"],
    }
    return templates.TemplateResponse(
        "blend-step-3.html", {"request": request, "summary": summary}
    )
