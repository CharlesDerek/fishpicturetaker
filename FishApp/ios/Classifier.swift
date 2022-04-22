//
//  Classifier.swift
//  FishApp
//
//  Created by Ashley James Sands on 5/5/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation
import TensorFlowLite

class Classifier {
  init?() {
    var options = InterpreterOptions()
    options.threadCount = 1
    options.isErrorLoggingEnabled = true
    do {
      let interpreter = try Interpreter(modelPath: "", options: options)
    } catch let error {
      print("Failed: \(error.localizedDescription)")
      return nil
    }
  }
}
