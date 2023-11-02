FROM python:3.9-slim

# Install dependencies
COPY src/requirements.txt /tmp/requirements.txt
RUN pip install --upgrade pip
RUN pip install -r /tmp/requirements.txt

# Install OpenCV headless and libffi to avoid errors
RUN apt-get update -y && \
    apt-get install -y python3-pip python3-cffi \
    python3-brotli libpango-1.0-0 libpangoft2-1.0-0
RUN pip uninstall -y opencv-python && \
    pip install opencv-python-headless

# Copy source code
COPY src /app
WORKDIR /app
