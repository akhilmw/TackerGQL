import Transaction from "../models/transaction.model.js";

const transactionResolver = {
    Query : {
        transactions : async(_,_,context) => {
            try {
                const contextUser = context.getUser()
                if(!contextUser){
                    throw new Error("Unauthorized");
                }
                const userId  = contextUser._id;

                const transactions = await Transaction.find({userId});
                
                return transactions;

            } catch (error) {
                console.log("Error getting transactions");
                throw new Error(`Error getting transactions : ${error}`);
            }
        },

        transaction : async(_, {transactionId}) => {
            try {
                const transaction = await Transaction.findById(transactionId);
                return transaction;
            } catch (error) {
                console.log("Error getting transaction");
                throw new Error(`Error getting transaction : ${error}`);
            }
        }

    },


    Mutation : {

        createTransaction : async(_, {input}, context) => {
            try {
                const newTransaction = new Transaction({
                    ...input,
                    userId : context.getUser()._id
                })

                await newTransaction.save();
                return newTransaction;
            } catch (error) {
                console.log("Error creating transaction");
                throw new Error(`Error creating transaction : ${error}`);
            }
        },

        updateTransaction : async(_, {input}) => {

            try {
                const updatedTransaction = await Transaction.findByIdAndUpdate(input.transactionId, input, {new : true});
                return updatedTransaction;

            } catch (error) {
                console.log("Error updating transaction");
                throw new Error(`Error updating transaction : ${error}`);
            }

        },
        deleteTransaction : async(_, {transactionId}) => {
            try {
                const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);
                return deletedTransaction;
            } catch (error) {
                console.log("Error deleting transaction");
                throw new Error(`Error deleting transaction : ${error}`);
            }
        }

    }
}

export default transactionResolver;