#!/bin/bash

set -e

echo "Starting development environment setup..."

command_exists() {
    command -v "$1" >/dev/null 2>&1
}

if ! command_exists rustc; then
    echo "Installing Rust..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source $HOME/.cargo/env
    rustup default stable
    rustup update
else
    echo "Rust is already installed."
fi

if ! command_exists bun; then
    echo "Installing Bun..."
    curl -fsSL https://bun.sh/install | bash
    source $HOME/.bashrc
else
    echo "Bun is already installed."
fi

if ! command_exists forge; then
    echo "Installing Foundry..."
    curl -L https://foundry.paradigm.xyz | bash
    source $HOME/.foundry/bin/foundryup
else
    echo "Foundry is already installed."
fi


echo "Setting up environment variables..."
export PATH="$HOME/.cargo/bin:$PATH"
export PATH="$HOME/.foundry/bin:$PATH"
export PATH="$HOME/.bun/bin:$PATH"

shell_config="$HOME/.bashrc"
if [ -f "$HOME/.zshrc" ]; then
    shell_config="$HOME/.zshrc"
fi

echo "
# Development environment setup
export PATH=\"\$HOME/.cargo/bin:\$PATH\"
export PATH=\"\$HOME/.foundry/bin:\$PATH\"
export PATH=\"\$HOME/.bun/bin:\$PATH\"
" >> "$shell_config"

source "$shell_config"

echo "Verifying installations..."
rustc --version
cargo --version
bun --version
forge --version

echo "Sab changa si"
