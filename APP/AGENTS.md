# App Agent Notes

- FastAPI entry point is `app/main.py` with Jinja2 templates in `app/templates` and static assets in `app/static`.
- Pre-made product data lives in `app/data.py` and is rendered for both listing and detail pages.
- Cart state is stored client-side in localStorage under `teaAlchemyCart` and rendered via `APP/static/cart.js` on product detail.
- Custom blend selection is stored in localStorage under `teaAlchemyBlend` and driven by `APP/static/blend.js`.
- Custom blend steps live on `/custom-blend/step-1` through `/custom-blend/step-4`; navigation gating relies on `data-blend-step` and `data-step-next` handled in `APP/static/blend.js`.
- Blend selection reconciliation should only persist on the step that owns those selections to avoid wiping `teaAlchemyBlend` state on other steps.
- Custom blend base data and outcome alignment live in `APP/data.py` (`BlendBase`, `BLEND_OUTCOME_AXES`) and drive step 2 UI.
- Base relevance sorting treats the Energy outcome as aligned to the "Alertness" axis.
- Functional botanicals are modeled in `APP/data.py` (`BlendBotanical`) and selected botanicals are persisted in `teaAlchemyBlend.selectedBotanicals`, with outcome visualization combining base + botanicals in `APP/static/blend.js`.
- Step 3 botanicals are sorted by relevance to the selected base (base alignment weighted by botanical contributions), capped at six options, and must stay within a 1-2 selection range in `APP/static/blend.js`.
- Outcome visualization is rendered as an SVG radar chart driven by `BLEND_OUTCOME_AXES` in `APP/static/blend.js`.
- Flavor botanicals are modeled in `APP/data.py` (`BlendFlavor`, `FLAVOR_CATEGORIES`) and stored in `teaAlchemyBlend.selectedFlavors`, with the spectrum rendered in `APP/static/blend.js`.
- Step 4 flavor botanicals are filtered by base + selected botanicals via `BlendFlavor.botanical_ids`, capped at six options, and must stay within a 1-2 selection range in `APP/static/blend.js`.
- Custom blend size selection uses `CUSTOM_BLEND_SIZES` in `APP/data.py` and persists to `teaAlchemyBlend.sizeLabel/sizeGrams/sizePrice` in `APP/static/blend.js`.
- Custom blend names persist in `teaAlchemyBlend.blendName` and preview in `APP/static/blend.js`.
- Cart review lives at `/cart`, rendering both `teaAlchemyCart` and `teaAlchemyBlend` via `APP/static/cart.js`, with removal actions handled client-side.
- Checkout lives at `/checkout`, with shipping and order summary computed client-side in `APP/static/checkout.js` from localStorage cart data.
- Checkout submission stores order details in localStorage under `teaAlchemyOrder` and redirects to `/confirmation`, which renders via `APP/static/confirmation.js`.
