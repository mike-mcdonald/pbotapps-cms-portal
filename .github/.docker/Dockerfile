FROM base

ARG USER
ARG GROUP

USER root

COPY --chown=root:${GROUP} . /var/www/html

WORKDIR /var/www/html

RUN find ./web -type d -exec chmod u=rwx,g=rx,o= '{}' \; && \
    find ./web -type f -exec chmod u=rw,g=r,o= '{}' \;

USER ${USER}
