from __future__ import annotations

from typing import List

from pydantic import BaseModel


class ProductSize(BaseModel):
    label: str
    grams: int
    price_aud: float


class Product(BaseModel):
    id: str
    name: str
    description: str
    outcomes: List[str]
    sizes: List[ProductSize]


PRODUCTS: List[Product] = [
    Product(
        id="solstice-rest",
        name="Solstice Rest",
        description="A dreamy evening blend with rooibos, vanilla, and chamomile for winding down.",
        outcomes=["Sleep", "Calm"],
        sizes=[
            ProductSize(label="50g", grams=50, price_aud=18.0),
            ProductSize(label="100g", grams=100, price_aud=32.0),
        ],
    ),
    Product(
        id="coastal-focus",
        name="Coastal Focus",
        description="Bright sencha, lemon myrtle, and ginkgo to keep the mind clear and steady.",
        outcomes=["Focus", "Calm"],
        sizes=[
            ProductSize(label="50g", grams=50, price_aud=20.0),
            ProductSize(label="100g", grams=100, price_aud=36.0),
        ],
    ),
    Product(
        id="morning-spark",
        name="Morning Spark",
        description="A lively black tea base with cacao nibs and orange peel for uplifting energy.",
        outcomes=["Energy", "Alertness"],
        sizes=[
            ProductSize(label="50g", grams=50, price_aud=19.0),
            ProductSize(label="100g", grams=100, price_aud=34.0),
        ],
    ),
    Product(
        id="quiet-glow",
        name="Quiet Glow",
        description="White tea with lavender and rose petals for a soft, soothing glow.",
        outcomes=["Calm", "Sleep"],
        sizes=[
            ProductSize(label="50g", grams=50, price_aud=21.0),
            ProductSize(label="100g", grams=100, price_aud=38.0),
        ],
    ),
]


def get_product(product_id: str) -> Product | None:
    for product in PRODUCTS:
        if product.id == product_id:
            return product
    return None
