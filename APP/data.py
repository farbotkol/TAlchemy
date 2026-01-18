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


class BlendBase(BaseModel):
    id: str
    title: str
    description: str
    alignment: dict[str, int]


class BlendOutcome(BaseModel):
    id: str
    title: str
    description: str
    bases: List[BlendBase]
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

BLEND_OUTCOME_AXES = ["Sleep", "Calm", "Focus", "Energy"]

CUSTOM_BLEND_OUTCOMES: List[BlendOutcome] = [
    BlendOutcome(
        id="sleep",
        title="Sleep",
        description="Slow the evening down with velvety, low-caffeine teas and lullaby botanicals.",
        bases=[
            BlendBase(
                id="sleep-rooibos",
                title="Rooibos",
                description="A naturally caffeine-free base with a mellow, vanilla-leaning sweetness.",
                alignment={"Sleep": 5, "Calm": 4, "Focus": 1, "Energy": 1},
            ),
            BlendBase(
                id="sleep-honeybush",
                title="Honeybush",
                description="Soft, honeyed body that supports evening rituals without stimulation.",
                alignment={"Sleep": 4, "Calm": 4, "Focus": 1, "Energy": 1},
            ),
            BlendBase(
                id="sleep-decaf-black",
                title="Decaf Black Tea",
                description="A fuller tea profile with minimal caffeine for a grounded nightcap.",
                alignment={"Sleep": 3, "Calm": 2, "Focus": 2, "Energy": 2},
            ),
        ],
        botanicals=["Chamomile", "Lavender", "Skullcap"],
    ),
    BlendOutcome(
        id="calm",
        title="Calm",
        description="Settle the nervous system with gentle florals and softly grounding botanicals.",
        bases=[
            BlendBase(
                id="calm-white-tea",
                title="White Tea",
                description="Delicate and airy with a soothing finish that keeps the blend light.",
                alignment={"Sleep": 3, "Calm": 5, "Focus": 3, "Energy": 2},
            ),
            BlendBase(
                id="calm-green-tea",
                title="Green Tea",
                description="Fresh vegetal notes for clarity without tipping into overstimulation.",
                alignment={"Sleep": 2, "Calm": 4, "Focus": 4, "Energy": 3},
            ),
            BlendBase(
                id="calm-rooibos",
                title="Rooibos",
                description="Caffeine-free warmth that anchors florals and herbal notes.",
                alignment={"Sleep": 4, "Calm": 4, "Focus": 1, "Energy": 1},
            ),
        ],
        botanicals=["Lemon Balm", "Rose", "Tulsi"],
    ),
    BlendOutcome(
        id="focus",
        title="Focus",
        description="Bright, clean energy with clarity-supporting botanicals and crisp teas.",
        bases=[
            BlendBase(
                id="focus-sencha",
                title="Sencha Green Tea",
                description="Clean oceanic lift for sustained attention without jittery peaks.",
                alignment={"Sleep": 1, "Calm": 3, "Focus": 5, "Energy": 3},
            ),
            BlendBase(
                id="focus-oolong",
                title="Oolong Tea",
                description="Balanced oxidation with gentle body for measured concentration.",
                alignment={"Sleep": 2, "Calm": 3, "Focus": 4, "Energy": 3},
            ),
            BlendBase(
                id="focus-black-tea",
                title="Black Tea",
                description="Brighter briskness that keeps the mind alert and present.",
                alignment={"Sleep": 1, "Calm": 2, "Focus": 4, "Energy": 4},
            ),
        ],
        botanicals=["Ginkgo", "Gotu Kola", "Peppermint"],
    ),
    BlendOutcome(
        id="energy",
        title="Energy",
        description="Spark the senses with bold bases and uplifting botanicals for alert momentum.",
        bases=[
            BlendBase(
                id="energy-assam",
                title="Assam Black Tea",
                description="Bold malty richness for a strong, energizing backbone.",
                alignment={"Sleep": 1, "Calm": 2, "Focus": 3, "Energy": 5},
            ),
            BlendBase(
                id="energy-yerba",
                title="Yerba Mate",
                description="Bright herbaceous lift that sustains long-lasting momentum.",
                alignment={"Sleep": 1, "Calm": 2, "Focus": 4, "Energy": 5},
            ),
            BlendBase(
                id="energy-smoked-oolong",
                title="Smoked Oolong",
                description="Toasty depth with a steady hum of alertness.",
                alignment={"Sleep": 1, "Calm": 2, "Focus": 3, "Energy": 4},
            ),
        ],
        botanicals=["Cacao Nibs", "Ginseng", "Orange Peel"],
    ),
]


def get_product(product_id: str) -> Product | None:
    for product in PRODUCTS:
        if product.id == product_id:
            return product
    return None
