FROM node:latest
USER root
RUN git clone https://github.com/helixious/user_oauth.git \
&& cd user_oauth \
&& npm install
