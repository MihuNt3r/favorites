module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testTimeout: 20000,
    // setupFilesAfterEnv: ["<rootDir/jestSetup.ts"],
    globals: {
        "ts-jest": {
            tsconfig: "./tsconfig.json",
        },
    }
}