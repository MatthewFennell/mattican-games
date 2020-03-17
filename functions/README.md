# Cloud Functions

## API Docs

* [**Active Team**](#active-team)
* [**Auth**](#auth)
* [**Common**](#common)
* [**Constants**](#constants)
* [**Leagues**](#leagues)
* [**Listeners**](#listeners)
* [**On Delete**](#on-delete)
* [**On Sign Up**](#on-sign-up)
* [**Players**](#players)
* [**Points**](#points)
* [**Teams**](#teams)
* [**Users**](#users)
* [**Weekly Teams**](#weekly-teams)

## Active Team

* ### `updateTeam`

#### Data Params

          {
            newTeam: [player_ids]
          }

* ### `getActiveTeam`

#### Data Params

          { }

#### Response

        {
          players: [...{
            goals, 
            price,
            assists,
            points,
            position, 
            previousScore, 
            name, 
            team,
            id,
          }]
          captain: CaptainID || `null`
        }

* ### `makeCaptain`

#### Data params

          {
            playerId: player_id
          }

* ### `removeCaptainWhenTeamUpdated` - Listener

      - Listens to writes on active-teams
      - If captain no longer in active team, set captain to `null`

## Auth

* ### `updateDisplayName`

#### Data Params

          {
            displayName: displayName
          }

* ### `updateTeamName`

#### Data Params

          {
            teamName: teamName
          }

* ### `usersWithExtraRoles`

#### Data Params

          { }

* ### `addUserRole`

#### Data Params

          {
            role: role,
            email: userEmail
           }

* ### `removeUserRole`

#### Data Params

          {
            role: role,
            email: userEmail
           }

* ### `getRolePermissions`

#### Data Params

          {
            role: role,
            email: userEmail
           }

#### Response

      Only shows the permissions for roles that they have
        {
          mappings:
          {
              ADMIN: [...Admin Permissions],
              MAINTAINER: [...Maintainer Permissions]
          },
          allRoles: [...All Available Roles]
        }

* ### `deleteUser`

#### Data Params

          { }

<!-- ## Common -->

<!-- ## Constants -->

## Leagues

* ### `createLeague`

#### Data Params

          {
            leagueName: leagueName,
            startWeek: startWeek
          }

* ### `getLeaguesIAmIn`

#### Data Params

          { }

#### Response

        [...{ 
          data: {
              position,
              teamName
              name, 
              username,
              start_week,
              user_points,
              user_id, 
              league_id
          },
          id
        }]

* ### `leaveLeague`

#### Data Params

          {
            leagueId: leagueId,
          }

* ### `joinLeague`

#### Data Params

          {
            leagueName: leagueName,
          }

* ### `orderedUsers`

#### Data Params

          { 
            week: week,
            previousId, (optional, used for pagination)
            leagueId,
            requestedSize (optional) - capped at 20
          }

#### Response

        {
          users: [...{
              data: {
                  user_id,
                  league_id,
                  position,
                  teamName,
                  name,
                  username,
                  start_week,
                  user_points,
                  week_points,
              },
              id
          }],
          numberOfUsers,
          leagueName
        }

* ### `calculatePositions`

#### Data Params

          { }
      - Correctly tags each league user with their position in the league

* ### `onUserJoinLeague` - Listener

      - Listens to when a user joins a league
      - Increases the number of users in that league by 1

* ### `onUserLeaveLeague` - Listener

      - Listens to when a user leaves a league
      - Decreases the number of users in that league by 1

## More Listeners

* ### `addStatsToPlayer`

      - Listens to player points changes
      - Finds the `player` it's referring to and updates their points / goals / assists

* ### `updateWeeklyTeams`

      - Listens to player points changes
      - Finds all `weeklyTeams` that have that player in it for that week
        - Loop through each weekly team and add points based on difference of old/new `playerPoints` document

* ### `updateWeeklyPlayers`

      - Listens to player points changes
      - Finds the `weeklyPlayer` for that playerId and week
      - Update the points on difference of old/new `playerPoints` document

* ### `updateUserScores`

      - Listens to player points changes
      - Finds the `weeklyTeams` for that playerId and week
        - Loop through each weekly team and find the `userId`
        - Update the points for that `userId` based on difference of old/new `playerPoints` document

* ### `updateLeaguesPoints`

      - Listens to player points changes
      - Finds the `weeklyTeams` for that playerId and week
        - Loop through each weekly team and find the `userId`
        - Find all the leagues that contain `userId` where the week >= league.startWeek
          - Loop through the leagues and update the points based on difference of old/new `playerPoints` document

* ### `addExtraCaptainPoints`

      - Listens to player points changes
      - Find all `weeklyTeams` where the `captainId` = playerPoints.id
      - Apply updateWeeklyPlayers, updateUserScores, updateLeaguesPoints again for the playerPoints.id

## On Delete

* ### `deleteUsersActiveTeam`

      - Listens to when users are deleted
      - Finds the `activeTeam` document that matches the deleted `userId` and delete it

* ### `deleteUsersLeaguesPoints`

      - Listens to when users are deleted
      - Finds the `leaguesPoints` document that matches the deleted `userId` and delete it

* ### `reorderPositions`

      - Listens to when `leaguesPoints` documents are deleted (from above)
      - Recalculate the positions of all users in the league

* ### `deleteUsersWithRoles`

      - Listens to when users are deleted
      - Delete any corresponding entries in `users-with-roles` collection

* ### `deleteWeeklyPlayers`

      - Listens to when users are deleted
      - Delete any weekly players for that user

* ### `deleteWeeklyTeams`

      - Listens to when users are deleted
      - Delete any weekly teams for that user

* ### `reduceNumberOfUsers`

      - Listens to when users are deleted
      - Reduce application number of users by 1

## On Sign Up

* ### `createInitialLeague`

      - Listens to when users sign up
      - If they are the first user to sign up and there is no league named Collingwood, create league and add them to it

* ### `joinInitialLeague`

      - Listens to when users sign up
      - If there is a league named Collingwood, add them to it

* ### `setAdminUserClaims`

      - Listens to when users sign up
      - If their email matches and config admin email, set them as an admin

* ### `increaseNumberOfUsers`

      - Listens to when users sign up
      - Increase the number of users by 1

* ### `createUserAccount`

      - Listens to when users sign up
      - Create a user document for that user

* ### `verifyFacebookEmail`

      - Listens to when users sign up
      - If they signed up with Facebook, verify their email

* ### `createInitialActiveTeam`

      - Listens to when users sign up
      - Create the user an initially empty active team

## Players

* ### `createPlayer`

#### Data Params

          {
            name: name
            position: GOALKEEPER / MIDFIELDER / DEFENDER / ATTACKER
            price: price
            team: teamName
            previousScore: score
          }

* ### `getAllPlayers`

#### Data Params

          { }

#### Response

        [...{
          id,
          goals,
          price,
          assists,
          points,
          position,
          previousScore,
          name,
          team
        }]

* ### `deletePlayer`

#### Data Params

          {
            playerId: playerId
          }

* ### `editPlayerStats`

#### Data Params

          {
            playerId: playerId,
            week: week,
            difference: {
              assists: 0,
              cleanSheet: true,
              dickOfTheDay: true,
              goals: 0,
              manOfTheMatch: true,
              ownGoals: 0,
              redCard: true,
              yellowCard: true
            }
          }

* ### `playerStats`

#### Data Params

          {
            playerId: playerId,
            week: week
          }

#### Response

        [...{
          goals: 0,
          cleanSheet: true,
          assists: 0,
          manOfTheMatch: true,
          redCard: true,
          yellowCard: true,
          ownGoals: 0,
          dickOfTheDay: true
        }]

## Points

* ### `userWithMostPoints`

#### Data Params

          {
            playerId: playerId,
            week: week
          }

#### Response

        [...{
          goals: 0,
          cleanSheet: true,
          assists: 0,
          manOfTheMatch: true,
          redCard: true,
          yellowCard: true,
          ownGoals: 0,
          dickOfTheDay: true
        }]

* ### `pointsForWeek`

#### Data Params

          {
            week: week,
            userId: userId
          }

#### Response

        [...{
          goals: 0,
          assists: 0,
          points: 0,
          redCard: false,
          yellowCard: false,
          cleanSheet: false,
          player_id: playerId,
          isCaptain: false,
          manOfTheMatch: false,
          dickOfTheDay: false,
          ownGoals: 0,
          name: name,
          team: 'England',
          position: 'GOALKEEPER'
        }]

* ### `submitResult`

#### Data Params

          {
            goalsAgainst: 0,
            goalsFor: 2,
            team: teamId,
            week: week
            players: {
              playerIdOne: {
                goals: 1,
                assists: 1
              },
              playerIdTwo: {
                goals: 3,
                assists: 1,
                cleanSheet: true,
                manOfTheMatch: true
              }
            }
          }

* ### `teamStatsByWeek`

#### Data Params

          {
            teamId: teamId,
            minWeek: minWeek,
            maxWeek: maxWeek
          }

#### Response

        [...{
          team: 'England',
          goals: 0,
          player_id: playerId,
          assists: 0,
          week: 0,
          points: 0,
          manOfTheMatch: true,
          position: 'MIDFIELDER',
          dickOfTheDay: true,
          name: name,
          ownGoals: 0,
          cleanSheet: true,
          yellowCard: true,
          redCard: true,
          id: id
        }]

## Teams

* ### `createTeam`

#### Data Params

          {
            teamName: teamName
          }

* ### `getAllTeams`

#### Data Params

          {
            teamName: teamName
          }

#### Response

        [...{
          id: id,
          draws: 0,
          goalsAgainst: 0,
          wins: 0,
          team_name: teamName,
          goalsFor: 0,
          losses: 0
        }]

* ### `getPlayersInTeam`

#### Data Params

          {
            teamName: teamName
          }

#### Response

        [...{
            name: name
            position: 'MIDFIELDER',
            id: id
        }]

* ### `deleteTeam`

#### Data Params

          {
            teamName: teamName,
            teamId: teamId
          }

## Users

* ### `userInfoForWeek`

#### Data Params

          {
            week: week,
            userId: userId
          }

#### Response

        {
          week_points: 0,
          average_points: 0,
          highest_points:
          {
              points: 0,
              id: id
          }
        }

* ### `userStats`

#### Data Params

          {
            userId: userId
          }

#### Response

        {
          remaining_budget: 0,
          remaining_transfers: 0,
          total_points: 0
        }

* ### `maxGameWeek`

#### Data Params

          { }

#### Response

        {
          0
        }

## Weekly Teams

* ### `triggerWeeklyTeams`

#### Data Params

          {
            week: week
          }

#### Actions

      - Increases the total number of weeks by 1
      - For each active team, make a weekly team for the triggered week
      - For each player in each active team, make a `weeklyPlayer`
