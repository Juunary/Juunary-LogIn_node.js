const Sequelize = require('sequelize');

class User extends Sequelize.Model{
    static initiate(sequelize){
            User.init({
                email:{
                    type: Sequelize.STRING(40),
                    allowNull: true,//카카오 로그인이면 이메일 x
                    unique: true,
                },
                nick: {
                    type: Sequelize.STRING(15),
                    allowNull: false,
                },
                password: {
                    type: Sequelize.STRING(100),//암호화 됐을때 문자열 연장 대비
                    allowNull: true,
                },
                provider: {
                    type: Sequelize.ENUM('local','kakao'),//이메일/카카오 구분
                    allowNull: false,
                    defavltValue: 'local'
                },
                snsID: {//이메일 대용 카카오
                    type: Sequelize.STRING(30),
                    allowNull: true,   
                }
            }, {
                sequelize,
                timestamps: true,//createdAT, updatedAt
                underscored: false,//created_at, updated_at
                modelName: 'User',
                tableName: 'users',
                paranoid: true,//유저 삭제일
                charset: 'utf8mb4',
                collate: 'utf8mb4_general_ci',
            })
    }
    static associate(db) {
        db.User.hasMany(db.Post);
        db.User.belongsToMany(db.User, {
          foreignKey: 'followingId',
          as: 'Followers',
          through: 'Follow',
        });
        db.User.belongsToMany(db.User, {
          foreignKey: 'followerId',
          as: 'Followings',
          through: 'Follow',
        });
      }
};
module.exports = User;