pipeline {
    agent {
        docker {
            image 'node:18-alpine'
            args '-u root:root'
        }
    }

    environment {
        // Ustawienie zmiennych środowiskowych dla CI
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
                // npm ci jest szybsze i bardziej niezawodne dla CI niż npm install
                sh 'npm ci'
            }
        }

        stage('Lint & Static Analysis') {
            steps {
                // Opcjonalnie: uruchomienie lintera, jeśli jest skonfigurowany
                catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                    sh 'npm run lint'
                }
            }
        }

        stage('Test') {
            steps {
                // Uruchamia testy (w tym chip.test.ts)
                sh 'npm test -- --coverage'
            }
            post {
                always {
                    // Archiwizacja wyników testów (wymaga pluginu JUnit w Jenkinsie)
                    junit '**/junit.xml'
                }
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        // Tutaj można dodać etap 'Deploy', np. wysyłkę na serwer FTP, AWS S3 lub Docker Registry
    }
}