FROM python:3.12.4-bookworm

WORKDIR /app

RUN pip install uv

COPY pyproject.toml ./
RUN uv sync --no-dev

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
