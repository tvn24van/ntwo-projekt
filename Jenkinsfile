pipeline {
    agent any

    environment {
        CI = 'true'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Lint & Static Analysis') {
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                    sh 'npm run lint'
                }
            }
        }

        stage('Test') {
            steps {
                sh 'npm test -- --coverage'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy to Verdaccio') {
            when {
                branch 'main'
            }
            steps {
                withCredentials([string(credentialsId: 'verdaccio-token', variable: 'NPM_TOKEN')]) {
                    sh '''
                      echo "//verdaccio:4873/:_authToken=${NPM_TOKEN}" > ~/.npmrc
                      npm publish --registry http://verdaccio:4873
                    '''
                }
            }
        }

    }
}
