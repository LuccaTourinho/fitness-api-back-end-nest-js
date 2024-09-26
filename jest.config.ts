export default {
    preset: 'ts-jest', // Usa o preset do ts-jest para projetos TypeScript
    testEnvironment: 'node', // Define o ambiente de teste como Node.js
    moduleNameMapper: {
      '^src/(.*)$': '<rootDir>/src/$1', // Mapeia imports com caminhos absolutos
    },
    moduleFileExtensions: ['ts', 'js', 'json', 'node'], // Extensões de arquivo reconhecidas
    transform: {
      '^.+\\.(ts)$': 'ts-jest', // Transforma arquivos TypeScript usando ts-jest
    },
    testPathIgnorePatterns: ['/node_modules/', '/dist/'], // Ignora essas pastas ao procurar por testes
  };
  