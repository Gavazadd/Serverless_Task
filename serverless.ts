import type { AWS } from '@serverless/typescript';
import {hello,signUp } from './src/functions';

const serverlessConfiguration: AWS = {
    service: 'aws-serverless-api',
    frameworkVersion: '3',
    plugins: ['serverless-esbuild'],
    provider: {
        name: 'aws',
        runtime: 'nodejs14.x',
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
        },
        iamRoleStatements: [
            {
                Effect: 'Allow',
                Action: [
                    'dynamodb:*',
                    'ses:*',
                    'sqs:*',
                ],
                Resource: '*',
            },
        ],
    },
    // import the function via paths
    functions: { hello, signUp},
    package: { individually: true },
    custom: {
        resources: {
            Resources: {
                UsersTable: {
                    Type: 'AWS::DynamoDB::Table',
                    Properties: {
                        TableName: 'Users',
                        AttributeDefinitions: [
                            {
                                AttributeName: 'id',
                                AttributeType: 'S',
                            },
                            {
                                AttributeName: 'email',
                                AttributeType: 'S',
                            },
                            {
                                AttributeName: 'password',
                                AttributeType: 'S',
                            },
                        ],
                        KeySchema: [
                            {
                                AttributeName: 'id',
                                KeyType: 'HASH',
                            },
                            {
                                AttributeName: 'email',
                                KeyType: 'RANGE',
                            },
                        ],
                        ProvisionedThroughput: {
                            ReadCapacityUnits: 5,
                            WriteCapacityUnits: 5,
                        },
                    },
                },
            },
        },
        esbuild: {
            bundle: true,
            minify: false,
            sourcemap: true,
            exclude: ['aws-sdk'],
            target: 'node14',
            define: { 'require.resolve': undefined },
            platform: 'node',
            concurrency: 10,
        },
    },
};

module.exports = serverlessConfiguration;