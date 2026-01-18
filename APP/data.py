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


class BlendFlavor(BaseModel):
    id: str
    title: str
    category: str
    notes: List[str]
    spectrum: dict[str, int]
    base_ids: List[str]
    incompatible_with: List[str]


class BlendOutcome(BaseModel):
    id: str
    title: str
    description: str
    bases: List[BlendBase]
    botanicals: List["BlendBotanical"]
    flavors: List[BlendFlavor]


class BlendBotanical(BaseModel):
    id: str
    title: str
    attributes: List[str]
    contributions: dict[str, int]
    base_ids: List[str]


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

BLEND_OUTCOME_AXES = ["Sleep", "Calm", "Focus", "Alertness"]
FLAVOR_CATEGORIES = ["Floral", "Citrus", "Earthy", "Spicy", "Sweet"]

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
                alignment={"Sleep": 5, "Calm": 4, "Focus": 1, "Alertness": 1},
            ),
            BlendBase(
                id="sleep-honeybush",
                title="Honeybush",
                description="Soft, honeyed body that supports evening rituals without stimulation.",
                alignment={"Sleep": 4, "Calm": 4, "Focus": 1, "Alertness": 1},
            ),
            BlendBase(
                id="sleep-decaf-black",
                title="Decaf Black Tea",
                description="A fuller tea profile with minimal caffeine for a grounded nightcap.",
                alignment={"Sleep": 3, "Calm": 2, "Focus": 2, "Alertness": 2},
            ),
        ],
        botanicals=[
            BlendBotanical(
                id="chamomile",
                title="Chamomile",
                attributes=["Nervine", "Gentle floral", "Night ritual"],
                contributions={"Sleep": 2, "Calm": 2, "Focus": 0, "Alertness": 0},
                base_ids=["sleep-rooibos", "sleep-honeybush", "sleep-decaf-black"],
            ),
            BlendBotanical(
                id="lavender",
                title="Lavender",
                attributes=["Soothing", "Aromatic", "Floral"],
                contributions={"Sleep": 1, "Calm": 2, "Focus": 0, "Alertness": 0},
                base_ids=["sleep-rooibos", "sleep-honeybush"],
            ),
            BlendBotanical(
                id="skullcap",
                title="Skullcap",
                attributes=["Deep calm", "Evening", "Herbal"],
                contributions={"Sleep": 2, "Calm": 1, "Focus": 0, "Alertness": 0},
                base_ids=["sleep-honeybush", "sleep-decaf-black"],
            ),
        ],
        flavors=[
            BlendFlavor(
                id="vanilla-bean",
                title="Vanilla Bean",
                category="Sweet",
                notes=["Creamy", "Dessert-like", "Soft finish"],
                spectrum={"Sweet": 3, "Floral": 1},
                base_ids=["sleep-rooibos", "sleep-honeybush", "sleep-decaf-black"],
                incompatible_with=["smoked-ginger"],
            ),
            BlendFlavor(
                id="lavender-bloom",
                title="Lavender Bloom",
                category="Floral",
                notes=["Aromatic", "Spa-like", "Gentle"],
                spectrum={"Floral": 3, "Sweet": 1},
                base_ids=["sleep-rooibos", "sleep-honeybush"],
                incompatible_with=["smoked-ginger"],
            ),
            BlendFlavor(
                id="citrus-peel",
                title="Citrus Peel",
                category="Citrus",
                notes=["Bright lift", "Lightly tart"],
                spectrum={"Citrus": 3, "Sweet": 1},
                base_ids=["sleep-decaf-black"],
                incompatible_with=["lavender-bloom"],
            ),
            BlendFlavor(
                id="cocoa-husk",
                title="Cocoa Husk",
                category="Earthy",
                notes=["Chocolatey", "Grounded"],
                spectrum={"Earthy": 3, "Sweet": 1},
                base_ids=["sleep-decaf-black", "sleep-honeybush"],
                incompatible_with=[],
            ),
            BlendFlavor(
                id="smoked-ginger",
                title="Smoked Ginger",
                category="Spicy",
                notes=["Warming", "Toasty"],
                spectrum={"Spicy": 3, "Earthy": 1},
                base_ids=["sleep-decaf-black"],
                incompatible_with=["vanilla-bean", "lavender-bloom"],
            ),
        ],
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
                alignment={"Sleep": 3, "Calm": 5, "Focus": 3, "Alertness": 2},
            ),
            BlendBase(
                id="calm-green-tea",
                title="Green Tea",
                description="Fresh vegetal notes for clarity without tipping into overstimulation.",
                alignment={"Sleep": 2, "Calm": 4, "Focus": 4, "Alertness": 3},
            ),
            BlendBase(
                id="calm-rooibos",
                title="Rooibos",
                description="Caffeine-free warmth that anchors florals and herbal notes.",
                alignment={"Sleep": 4, "Calm": 4, "Focus": 1, "Alertness": 1},
            ),
        ],
        botanicals=[
            BlendBotanical(
                id="lemon-balm",
                title="Lemon Balm",
                attributes=["Stress ease", "Citrus lift", "Herbal"],
                contributions={"Sleep": 1, "Calm": 2, "Focus": 1, "Alertness": 0},
                base_ids=["calm-white-tea", "calm-green-tea", "calm-rooibos"],
            ),
            BlendBotanical(
                id="rose",
                title="Rose",
                attributes=["Heart soothing", "Aromatic", "Floral"],
                contributions={"Sleep": 1, "Calm": 2, "Focus": 0, "Alertness": 0},
                base_ids=["calm-white-tea", "calm-rooibos"],
            ),
            BlendBotanical(
                id="tulsi",
                title="Tulsi",
                attributes=["Adaptogen", "Grounding", "Herbal"],
                contributions={"Sleep": 0, "Calm": 2, "Focus": 1, "Alertness": 1},
                base_ids=["calm-green-tea", "calm-rooibos"],
            ),
        ],
        flavors=[
            BlendFlavor(
                id="rose-petal",
                title="Rose Petal",
                category="Floral",
                notes=["Romantic", "Soft", "Velvety"],
                spectrum={"Floral": 3, "Sweet": 1},
                base_ids=["calm-white-tea", "calm-rooibos"],
                incompatible_with=["cardamom-spark"],
            ),
            BlendFlavor(
                id="lemongrass",
                title="Lemongrass",
                category="Citrus",
                notes=["Clean citrus", "Bright"],
                spectrum={"Citrus": 3, "Floral": 1},
                base_ids=["calm-green-tea", "calm-white-tea"],
                incompatible_with=["sandalwood"],
            ),
            BlendFlavor(
                id="sandalwood",
                title="Sandalwood",
                category="Earthy",
                notes=["Resinous", "Meditative"],
                spectrum={"Earthy": 3, "Spicy": 1},
                base_ids=["calm-rooibos"],
                incompatible_with=["lemongrass"],
            ),
            BlendFlavor(
                id="cardamom-spark",
                title="Cardamom Spark",
                category="Spicy",
                notes=["Aromatic", "Warm"],
                spectrum={"Spicy": 3, "Sweet": 1},
                base_ids=["calm-green-tea", "calm-rooibos"],
                incompatible_with=["rose-petal"],
            ),
            BlendFlavor(
                id="honey-nut",
                title="Honeyed Nut",
                category="Sweet",
                notes=["Toasty", "Comforting"],
                spectrum={"Sweet": 3, "Earthy": 1},
                base_ids=["calm-rooibos", "calm-white-tea"],
                incompatible_with=[],
            ),
        ],
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
                alignment={"Sleep": 1, "Calm": 3, "Focus": 5, "Alertness": 3},
            ),
            BlendBase(
                id="focus-oolong",
                title="Oolong Tea",
                description="Balanced oxidation with gentle body for measured concentration.",
                alignment={"Sleep": 2, "Calm": 3, "Focus": 4, "Alertness": 3},
            ),
            BlendBase(
                id="focus-black-tea",
                title="Black Tea",
                description="Brighter briskness that keeps the mind alert and present.",
                alignment={"Sleep": 1, "Calm": 2, "Focus": 4, "Alertness": 4},
            ),
        ],
        botanicals=[
            BlendBotanical(
                id="ginkgo",
                title="Ginkgo",
                attributes=["Cognitive", "Circulation", "Bright"],
                contributions={"Sleep": 0, "Calm": 1, "Focus": 2, "Alertness": 1},
                base_ids=["focus-sencha", "focus-oolong", "focus-black-tea"],
            ),
            BlendBotanical(
                id="gotu-kola",
                title="Gotu Kola",
                attributes=["Mindful focus", "Adaptogen", "Herbal"],
                contributions={"Sleep": 0, "Calm": 1, "Focus": 2, "Alertness": 0},
                base_ids=["focus-oolong", "focus-black-tea"],
            ),
            BlendBotanical(
                id="peppermint",
                title="Peppermint",
                attributes=["Cooling", "Alertness", "Fresh"],
                contributions={"Sleep": 0, "Calm": 1, "Focus": 1, "Alertness": 2},
                base_ids=["focus-sencha", "focus-black-tea"],
            ),
        ],
        flavors=[
            BlendFlavor(
                id="jasmine-veil",
                title="Jasmine Veil",
                category="Floral",
                notes=["Silky aroma", "Elegant"],
                spectrum={"Floral": 3, "Citrus": 1},
                base_ids=["focus-sencha", "focus-oolong"],
                incompatible_with=["toasted-nut"],
            ),
            BlendFlavor(
                id="bergamot-zest",
                title="Bergamot Zest",
                category="Citrus",
                notes=["Bright", "Tea-room classic"],
                spectrum={"Citrus": 3, "Floral": 1},
                base_ids=["focus-black-tea", "focus-oolong"],
                incompatible_with=["brown-sugar"],
            ),
            BlendFlavor(
                id="toasted-nut",
                title="Toasted Nut",
                category="Earthy",
                notes=["Grounded", "Nutty"],
                spectrum={"Earthy": 3, "Sweet": 1},
                base_ids=["focus-oolong", "focus-black-tea"],
                incompatible_with=["jasmine-veil"],
            ),
            BlendFlavor(
                id="pepper-mint",
                title="Pepper Mint",
                category="Spicy",
                notes=["Cooling bite", "Sharp"],
                spectrum={"Spicy": 3, "Citrus": 1},
                base_ids=["focus-sencha", "focus-black-tea"],
                incompatible_with=["brown-sugar"],
            ),
            BlendFlavor(
                id="brown-sugar",
                title="Brown Sugar",
                category="Sweet",
                notes=["Caramelized", "Warm"],
                spectrum={"Sweet": 3, "Earthy": 1},
                base_ids=["focus-black-tea"],
                incompatible_with=["bergamot-zest", "pepper-mint"],
            ),
        ],
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
                alignment={"Sleep": 1, "Calm": 2, "Focus": 3, "Alertness": 5},
            ),
            BlendBase(
                id="energy-yerba",
                title="Yerba Mate",
                description="Bright herbaceous lift that sustains long-lasting momentum.",
                alignment={"Sleep": 1, "Calm": 2, "Focus": 4, "Alertness": 5},
            ),
            BlendBase(
                id="energy-smoked-oolong",
                title="Smoked Oolong",
                description="Toasty depth with a steady hum of alertness.",
                alignment={"Sleep": 1, "Calm": 2, "Focus": 3, "Alertness": 4},
            ),
        ],
        botanicals=[
            BlendBotanical(
                id="cacao-nibs",
                title="Cacao Nibs",
                attributes=["Mood lift", "Rich", "Uplifting"],
                contributions={"Sleep": 0, "Calm": 0, "Focus": 1, "Alertness": 2},
                base_ids=["energy-assam", "energy-smoked-oolong"],
            ),
            BlendBotanical(
                id="ginseng",
                title="Ginseng",
                attributes=["Adaptogen", "Vitality", "Rooty"],
                contributions={"Sleep": 0, "Calm": 0, "Focus": 2, "Alertness": 2},
                base_ids=["energy-assam", "energy-yerba"],
            ),
            BlendBotanical(
                id="orange-peel",
                title="Orange Peel",
                attributes=["Zesty", "Aromatic", "Bright"],
                contributions={"Sleep": 0, "Calm": 0, "Focus": 1, "Alertness": 2},
                base_ids=["energy-yerba", "energy-smoked-oolong"],
            ),
        ],
        flavors=[
            BlendFlavor(
                id="hibiscus-glow",
                title="Hibiscus Glow",
                category="Floral",
                notes=["Tart floral", "Vibrant"],
                spectrum={"Floral": 3, "Citrus": 1},
                base_ids=["energy-yerba", "energy-assam"],
                incompatible_with=["clove-heat"],
            ),
            BlendFlavor(
                id="blood-orange",
                title="Blood Orange",
                category="Citrus",
                notes=["Juicy", "Lively"],
                spectrum={"Citrus": 3, "Sweet": 1},
                base_ids=["energy-yerba", "energy-smoked-oolong"],
                incompatible_with=["molasses-sugar"],
            ),
            BlendFlavor(
                id="cacao-bark",
                title="Cacao Bark",
                category="Earthy",
                notes=["Roasted", "Bold"],
                spectrum={"Earthy": 3, "Sweet": 1},
                base_ids=["energy-assam", "energy-smoked-oolong"],
                incompatible_with=["hibiscus-glow"],
            ),
            BlendFlavor(
                id="clove-heat",
                title="Clove Heat",
                category="Spicy",
                notes=["Spiced", "Fiery"],
                spectrum={"Spicy": 3, "Earthy": 1},
                base_ids=["energy-assam", "energy-smoked-oolong"],
                incompatible_with=["hibiscus-glow"],
            ),
            BlendFlavor(
                id="molasses-sugar",
                title="Molasses Sugar",
                category="Sweet",
                notes=["Dark sweetness", "Rich"],
                spectrum={"Sweet": 3, "Earthy": 1},
                base_ids=["energy-assam"],
                incompatible_with=["blood-orange"],
            ),
        ],
    ),
]


def get_product(product_id: str) -> Product | None:
    for product in PRODUCTS:
        if product.id == product_id:
            return product
    return None
