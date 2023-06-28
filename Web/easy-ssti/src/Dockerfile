FROM rust:latest

COPY ./content ./
COPY ./config  $HOME/.cargo/config

ENV RUSTUP_DIST_SERVER=https://mirrors.ustc.edu.cn/rust-static
ENV RUSTUP_UPDATE_ROOT=https://mirrors.ustc.edu.cn/rust-static/rustup

RUN cargo build 

EXPOSE 8080

CMD ["./target/debug/easy-ssti"]