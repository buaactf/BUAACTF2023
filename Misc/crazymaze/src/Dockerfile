FROM python:3.8-slim
RUN pip install --no-cache-dir numpy
WORKDIR /opt/ctf
RUN mkdir -p /opt/ctf
COPY . .
EXPOSE 25553
CMD ["python", "-u", "app.py"]