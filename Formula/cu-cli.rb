require "language/node"

class CuCli < Formula
  desc "Fast, lightweight ClickUp CLI for managing tasks and workspaces"
  homepage "https://github.com/AndroidPoet/cu-cli"
  url "https://github.com/AndroidPoet/cu-cli/archive/refs/tags/v1.0.0.tar.gz"
  sha256 "REPLACE_WITH_ACTUAL_SHA"
  license "MIT"

  depends_on "node"

  def install
    system "npm", "install", *Language::Node.std_npm_install_args(libexec)
    bin.install_symlink Dir["#{libexec}/bin/*"]
  end

  test do
    system "#{bin}/cu-cli", "--version"
  end
end
