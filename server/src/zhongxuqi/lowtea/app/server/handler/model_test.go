package handler

import (
	"testing"
	"time"
)

func Test_clearSession(t *testing.T) {
	handler := New()

	handler.SessMap["1"] = time.Now().Unix() - 60
	handler.SessMap["2"] = time.Now().Unix() - 60
	handler.SessMap["3"] = time.Now().Unix() + 60
	handler.SessMap["4"] = time.Now().Unix() + 60

	handler.clearSession()
	cnt := 0
	for k := range handler.SessMap {
		if k == "1" || k == "2" {
			t.Error("clearSession test fail")
			return
		}
		cnt++
	}
	if cnt != 2 {
		t.Error("clearSession test fail")
		return
	}
	t.Log("clearSession test pass")
}
