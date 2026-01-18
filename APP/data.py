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


class BlendOutcome(BaseModel):
    id: str
    title: str
    description: str
    bases: List[str]
    botanicals: List[str]


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

CUSTOM_BLEND_OUTCOMES: List[BlendOutcome] = [
    BlendOutcome(
        id="sleep",
        title="Sleep",
        description="Slow the evening down with velvety, low-caffeine teas and lullaby botanicals.",
        bases=["Rooibos", "Honeybush", "Decaf Black Tea"],
        botanicals=["Chamomile", "Lavender", "Skullcap"],
    ),
    BlendOutcome(
        id="calm",
        title="Calm",
        description="Settle the nervous system with gentle florals and softly grounding botanicals.",
        bases=["White Tea", "Green Tea", "Rooibos"],
        botanicals=["Lemon Balm", "Rose", "Tulsi"],
    ),
    BlendOutcome(
        id="focus",
        title="Focus",
        description="Bright, clean energy with clarity-supporting botanicals and crisp teas.",
        bases=["Sencha Green Tea", "Oolong Tea", "Black Tea"],
        botanicals=["Ginkgo", "Gotu Kola", "Peppermint"],
    ),
    BlendOutcome(
        id="energy",
        title="Energy",
        description="Spark the senses with bold bases and uplifting botanicals for alert momentum.",
        bases=["Assam Black Tea", "Yerba Mate", "Smoked Oolong"],
        botanicals=["Cacao Nibs", "Ginseng", "Orange Peel"],
    ),
]


def get_product(product_id: str) -> Product | None:
    for product in PRODUCTS:
        if product.id == product_id:
            return product
    return None
