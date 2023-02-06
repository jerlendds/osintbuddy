FROM archlinux:latest

RUN pacman -Syu --noconfirm
RUN pacman -Sy --noconfirm git wget curl python-pip
RUN pacman -Sy  --noconfirm radare2 tcpdump
RUN pip install setuptools 

# https://github.com/megadose/holehe -- Holehe checks if an email is attached to an account on sites like twitter, instagram, imgur and more than 120 others.
RUN git clone https://github.com/megadose/holehe.git && \
    cd holehe/ && \
    python3 setup.py install


# https://github.com/mxrch/GHunt -- GHunt (v2) is an offensive Google framework, designed to evolve efficiently.
RUN cd ../ && pip3 install pipx && \
    pipx ensurepath && \
    pipx install ghunt

