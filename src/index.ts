import { RunServicesUseCase } from './application/use-cases/RunServicesUseCase';

async function main() {
    console.log('Iniciando Serviços de Sincronização. Pressione Ctrl+C para encerrar.');
    await RunServicesUseCase.start();
}

function dispose() {
  console.log('Encerrando serviços...');
  RunServicesUseCase.stop();
  process.exit(0);
}

process.on('SIGINT', dispose);
process.on('SIGTERM', dispose);

main();
