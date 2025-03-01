import os from 'os';
import { Worker } from 'worker_threads';

let workers: Worker[] = [];

const initWorkers = async (): Promise<boolean> => {
    try {
        const nbCpus = os.cpus().length;
        console.log(`Initializing ${nbCpus} workers...`);

        for (let i = 0; i < nbCpus; i++) {
            const worker = initWorker();

            if (worker) {
                workers.push(worker);
            }
        }

        console.log(`${workers.length} workers initialized.`);
        return true;
    } catch (err: any) {
        console.error('Error initializing workers:', err);
        return false;
    }
};

const stopWorkers = async (): Promise<void> => {
    if (workers.length === 0) {
        console.log('No workers to stop.');
        return;
    }

    console.log(`Stopping ${workers.length} workers...`);

    await Promise.all(
        workers.map((worker) => {
            return new Promise<void>((resolve) => {
                worker.postMessage({ action: 'stop' });
                worker.on('exit', () => resolve());
            });
        })
    );

    console.log(`${workers.length} workers stopped.`);
    workers = [];
};

const initWorker = (): Worker => {
    const HIDE_STDS = process.env.HIDE_WORKER_STDS?.toLowerCase() === 'true';
    const worker = new Worker(__dirname + '/crawl.js', {
        stderr: HIDE_STDS,
        stdin: HIDE_STDS,
        stdout: HIDE_STDS
    });

    worker.on('error', (err: any) => {
        console.error(err);
    });

    worker.on('messageerror', (err: any) => {
        console.error(err);
    });

    worker.on('exit', (code: number) => {
        if (code !== 0) {
            console.log(`Worker stopped with exit code ${code}`);
        }
    });

    worker.on('message', (message: any) => {
        console.log('[Worker n°' + worker.threadId + '] ' + message);
    });

    return worker;
};

export { initWorkers, stopWorkers };
