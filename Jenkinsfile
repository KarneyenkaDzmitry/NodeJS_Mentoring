node {
    env.NODEJS_HOME = tool 'NodeJS-14'
    env.PATH = "${env.NODEJS_HOME}/bin:${env.PATH}"
    stage('CleanUp'){
        deleteDir()
        sh "git checkout $GIT_BRANCH"
    }
    stage('SonarQube analysis') {
      scannerHome = tool'SonarQube-Scaner'
      withSonarQubeEnv('SonarQube-Server') {
          sh "ls -lA" 
          sh "pwd"
          sh "echo ${scannerHome}"
          sh "${scannerHome}/bin/sonar-scanner -Dproject.settings=./sonar.properties"
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
