node {
    env.NODEJS_HOME = tool 'NodeJS-14'
    env.PATH = "${env.NODEJS_HOME}/bin:${env.PATH}"
    stage('CleanUp'){
        deleteDir()
    }
    stage('SCM') {
      git 'file:///var/jenkins_home/repositories/nodejs_mentoring_program'
      sh "git checkout $BRANCH_NAME"
      sh 'pwd'
      sh 'ls -la'
    }
    stage('SonarQube analysis') {
      scannerHome = tool'SonarQube-Scaner'
      withSonarQubeEnv('SonarQube-Server') {
          sh "echo ${scannerHome}"
          sh "${scannerHome}/bin/sonar-scanner -Dproject.settings=./sonar.properties"
      }
    }
   stage('Quality Gate') {
       timeout(time: 10, unit: 'MINUTES') {
          qg = waitForQualityGate()
          if (qg.status != 'OK') {
              error "Pipeline aborted due to quality gate failure: ${qg.status}"
          }
       }
    }
}
