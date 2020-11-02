import {Sequelize, DataTypes} from './config/database';



// const Model = {
//     User: User(Sequelize, DataTypes),
//     Post: Post(Sequelize, DataTypes),
//     UserPost: UserPost(Sequelize, DataTypes),
//     UserProvider: UserProvider(Sequelize, DataTypes)
// };

// Model.UserProvider.belongsToMany(Model.User, {through: 'user_provider', foreignKey: 'user_id'});
// Model.UserPost.belongsToMany(Model.User, {through: 'user_post', foreignKey: 'user_id'});

// const init = async (cb) => {
//     // await Sequelize.sync();
//     await Sequelize.sync({force:true});
//     cb();
// }

// const fakeUser = () => {
//     let fname = Faker.name.firstName();
//     let lname = Faker.name.lastName();
//     let name = `${fname} ${lname}`;
//     let email = `${fname}.${lname}@gmail.com`.toLowerCase();
//     return {name, email};
// }


// const createUser = async (cb) => {
//     try {
//         let {name, email} = fakeUser();
//         let user = await Model.User.create({
//             name: name,
//             email: email,
//             state: 'active'
//         }); 
//         return cb ? cb(user) : user;
//     } catch(e) {
//         return cb ? cb(e) : e;
//     }
// }

// const createPost = async (cb) => {
//     try {
//         let post = await Model.Post.create({
//            title: Faker.commerce.productName(),
//            description: Faker.commerce.productDescription()
//         });
//         return cb ? cb(post) : post;
//     } catch(e) {
//         return cb ? cb(e) : e;
//     }
// };

// const findUserProvider = async (providerId, providerName, cb) => {
//     try {
//         let user = await Model.User.findOne( {
//             where: {
//                 id: providerId,
//                 name: providerName
//         }} );
//         return user;
//     } catch(e) {
//         return e;
//     }
// };
import UserModel from './models/user';
import UserProviderModel from './models/user_provider';

class ORM {
    constructor() {
        const User = UserModel(Sequelize, DataTypes);
        const UserProvider = UserProviderModel(Sequelize, DataTypes);
        this.model = { User, UserProvider};

        User.belongsToMany(UserProvider, {through: UserProvider, as: 'userProvider', onDelete: 'CASCADE', foreignKey: 'user_id'});
        UserProvider.belongsTo(User);

        Sequelize.authenticate().then(() => {
            console.log('Database connected...');
            this.init().then(() => {

            })
        }).catch(err => {
            console.log('Error:', err);
            process.exit(1);
        })
        


        
        
        
        // this.model.UserProvider.belongsTo(this.model.User, {foreignKey: 'user_id'});
        // this.model.UserProvider.belongsToMany(this.model.User, {through: 'user_provider', foreignKey: 'user_id'});
        // this.model.UserPost.belongsToMany(this.model.User, {through: 'user_post', foreignKey: 'user_id'});
    }
    
    async createUser(name, email, cb) {
        const {User} = this.model;
        try {
            let {name, email} = fakeUser();
            let user = await User.create({
                name: name,
                email: email,
                state: 'active'
            }); 
            return cb ? cb(user) : user;
        } catch(e) {
            return cb ? cb(e) : e;
        }
    }

    async createUserProvider(userId, providerId, provider, cb) {
        const {UserProvider} = this.model;
        const userProvider = await UserProvider.create({
            id: providerId,
            user_id: userId,
            name: provider
        })
    }
    async upsertProvider(data) {
        const {provider, providerId, name, email} = data;
        const {UserProvider, User} = this.model;
        try {

            let userProvider = null;
            let user = await User.findOne({
                where: {
                    email: email
                }
            });


            if(!user) {
                user = await User.create({
                    name: name,
                    email: email,
                    state: 'active'
                });

                // console.log(user);
                console.log('test');

            } else {
                userProvider = await UserProvider.findOne({
                    where: {
                        id: providerId,
                        name: provider,
                        user_id: user.id
                    }
                })
            }

            if(!userProvider) {
                userProvider = await UserProvider.create({
                    name: provider,
                    id: providerId,
                    user_id: user.id
                });
            }
            // await user.destroy();

            // const providers = User.getProviders();
            // console.log(providers);
            // cb(null, {user:user.id});
            return {entityId: user.id, name: user.name};
            // return cb ? cb(userProviderSearch) : userProviderSearch;
            // if(userProviderSearch) {
            //     console.log('existing userProvider');
            // } else {
            //     const userProvider = await UserProvider.create({
            //        id: providerId,
            //        user_id: userId,
            //        name: provider 
            //     });
            //     console.log('new userProvider');
            // }
        } catch(e) {
            return cb ? cb(e) : e;
        }
        
    }

    async findUserProvider(providerId, provider, cb) {
        const {UserProvider} = this.model;
    };

    async init(cb) {
        await Sequelize.sync();
        // await Sequelize.sync({force:true});
        return cb ? cb() : null;
    }
}

export default new ORM();