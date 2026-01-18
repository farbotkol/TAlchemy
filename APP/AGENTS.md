# App Agent Notes

- FastAPI entry point is `APP/main.py` with Jinja2 templates in `APP/templates` and static assets in `APP/static`.
- Pre-made product data lives in `APP/data.py` and is rendered for both listing and detail pages.
- Cart state is stored client-side in localStorage under `teaAlchemyCart` and rendered via `APP/static/cart.js` on product detail.
- Custom blend selection is stored in localStorage under `teaAlchemyBlend` and driven by `APP/static/blend.js`.
