import "@testing-library/jest-dom";

// jsdom doesn't expose fetch; RTK Query warns at import time without it.
globalThis.fetch ??= jest.fn() as unknown as typeof fetch;
