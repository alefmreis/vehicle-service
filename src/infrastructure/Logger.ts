import winston from 'winston';

const { combine, timestamp, printf } = winston.format;

function NewLogger(logLevel: string, serviceName: string): winston.Logger {
  const format = printf(({ timestamp, level, message, service, ...data }) => {
    return JSON.stringify({
      timestamp,
      level,
      message,
      metadata: { service },
      data: { ...data }
    });
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