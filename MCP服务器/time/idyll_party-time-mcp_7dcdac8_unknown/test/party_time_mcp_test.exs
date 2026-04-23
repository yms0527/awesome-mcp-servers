defmodule PartyTimeMcpTest do
  use ExUnit.Case
  doctest PartyTimeMcp

  test "greets the world" do
    assert PartyTimeMcp.hello() == :world
  end
end
