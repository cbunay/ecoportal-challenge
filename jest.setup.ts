import "@testing-library/jest-dom";

globalThis.fetch ??= jest.fn() as unknown as typeof fetch;
