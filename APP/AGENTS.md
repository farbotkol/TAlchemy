# App Agent Notes

- FastAPI entry point is `app/main.py` with Jinja2 templates in `app/templates` and static assets in `app/static`.
- Pre-made product data currently lives in `app/data.py` and is rendered for both listing and detail pages.
- Cart state is stored client-side in localStorage under `teaAlchemyCart` and rendered via `app/static/cart.js` on product detail.
