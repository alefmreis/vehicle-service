import winston from 'winston';

import { trace, context } from '@opentelemetry/api';

const { combine, timestamp, printf } = winston.format;

function NewLogger(logLevel: string, serviceName: string): winston.Logger {
  const format = printf(({ timestamp, level, message, service, ...data }) => {
    const currentSpan = trace.getSpan(context.active());

    const log = {
      timestamp,
      level,
      message,
      metadata: { service, 'trace-id': currentSpan ? currentSpan.spanContext().traceId : null },
      data: { ...data }
    };

    return JSON.stringify(log);
  });

  return winston.createLogger({
    level: logLevel,
    defaultMeta: {
      service: serviceName
    },
    format: combine(timestamp(), format),
    transports: [new winston.transports.Console()],
  });
}

export default NewLogger;