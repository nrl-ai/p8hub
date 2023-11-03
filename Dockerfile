FROM --platform=$BUILDPLATFORM node:18.9-alpine3.15 AS client-builder

WORKDIR /ui
COPY frontend/package.json /ui/package.json
COPY frontend/package-lock.json /ui/package-lock.json
RUN npm install

COPY frontend /ui
RUN npm run build

FROM alpine

ENV PYTHONUNBUFFERED=1
RUN apk --update --upgrade add python3 python3-dev gcc musl-dev jpeg-dev zlib-dev libffi-dev cairo-dev pango-dev gdk-pixbuf-dev docker-cli docker-compose
RUN ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

LABEL org.opencontainers.image.title="P8Hub - Private AI Hub" \
    org.opencontainers.image.description="Host and use your own AI Services. Keep everything simple and private." \
    org.opencontainers.image.vendor="Viet-Anh NGUYEN" \
    com.docker.desktop.extension.api.version=">= 0.2.0" \
    com.docker.desktop.extension.icon="https://raw.githubusercontent.com/vietanhdev/vietanhdev/main/p8hub/p8hub.png" \
    com.docker.extension.screenshots='[{"alt":"P8Hub Screenshot", "url":"https://raw.githubusercontent.com/vietanhdev/vietanhdev/main/p8hub/screenshot.png"}]' \
    com.docker.extension.detailed-description="<h1>Description</h1><p>Host and use your own AI Services. Keep everything simple and private.</p>" \
    com.docker.extension.publisher-url="https://www.docker.com" \
    com.docker.extension.additional-urls='[{"title":"SDK Documentation","url":"https://docs.docker.com/desktop/extensions-sdk"}]' \
    com.docker.extension.changelog="<ul><li>Added metadata to provide more information about the extension.</li></ul>"

COPY docker-compose.yaml docker-compose.yaml
COPY metadata.json metadata.json
COPY images/p8hub.svg p8hub.svg
COPY extension-ui ui

COPY p8hub /workspace/p8hub
COPY setup.py /workspace
COPY README.md /workspace
COPY pyproject.toml /workspace
COPY MANIFEST.in /workspace
COPY --from=client-builder /ui/out /workspace/p8hub/frontend-dist
RUN cd /workspace && pip3 install -e .

CMD python3 -m p8hub.app --environment extension
