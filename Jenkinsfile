node {
    env.NODEJS_HOME = "${tool 'NodeJS-14'}"
    env.PATH = "${env.NODEJS_HOME}/bin:${env.PATH}"
    stage('CleanUp'){
        deleteDir()
    }
  stage('SonarQube analysis') {
      sh 'echo $PATH'
    scannerHome = tool'SonarQube-Scaner'
    withSonarQubeEnv {
        sh "echo ${scannerHome}"
        sh "${scannerHome}/bin/sonar-scanner"
    }
  }
   stage('Quality Gate') {
       timeout(time: 3, unit: 'MINUTES') {
              qg = waitForQualityGate()
              if (qg.status != 'OK') {
                  error "Pipeline aborted due to quality gate failure: ${qg.status}"
              }
       }
    }
}
